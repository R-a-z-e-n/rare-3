from __future__ import annotations

import math
from typing import Any


def get_custom_objects() -> dict[str, Any]:
    import keras
    from keras import layers, ops

    @keras.saving.register_keras_serializable(name="MBConvBlock")
    class MBConvBlock(layers.Layer):
        def __init__(
            self,
            filters: int,
            kernel_size: int,
            strides: int,
            expand_ratio: int,
            se_ratio: float,
            drop_connect_rate: float,
            input_filters: int,
            **kwargs: Any,
        ) -> None:
            super().__init__(**kwargs)
            self.filters = filters
            self.kernel_size = kernel_size
            self.strides = strides
            self.expand_ratio = expand_ratio
            self.se_ratio = se_ratio
            self.drop_connect_rate = drop_connect_rate
            self.input_filters = input_filters
            self.expanded_filters = input_filters * expand_ratio
            self.has_skip = strides == 1 and input_filters == filters

            if expand_ratio != 1:
                self.expand_conv = layers.Conv2D(
                    self.expanded_filters,
                    1,
                    padding="same",
                    use_bias=False,
                    name="expand_conv",
                )
                self.expand_bn = layers.BatchNormalization(name="expand_bn")

            self.depthwise_conv = layers.DepthwiseConv2D(
                kernel_size,
                strides=strides,
                padding="same",
                use_bias=False,
                name="depthwise_conv",
            )
            self.depthwise_bn = layers.BatchNormalization(name="depthwise_bn")
            self.se_block = SEBlock(self.expanded_filters, se_ratio, name="se_block")
            self.project_conv = layers.Conv2D(
                filters,
                1,
                padding="same",
                use_bias=False,
                name="project_conv",
            )
            self.project_bn = layers.BatchNormalization(name="project_bn")
            if self.has_skip and drop_connect_rate > 0:
                self.dropout = layers.Dropout(drop_connect_rate, name="dropout")

        def build(self, input_shape: Any) -> None:
            x_shape = tuple(input_shape)
            if self.expand_ratio != 1:
                self.expand_conv.build(x_shape)
                x_shape = _conv_output_shape(x_shape, self.expanded_filters, 1)
                self.expand_bn.build(x_shape)

            self.depthwise_conv.build(x_shape)
            x_shape = _conv_output_shape(x_shape, self.expanded_filters, self.strides)
            self.depthwise_bn.build(x_shape)
            self.se_block.build(x_shape)
            self.project_conv.build(x_shape)
            x_shape = _conv_output_shape(x_shape, self.filters, 1)
            self.project_bn.build(x_shape)
            if hasattr(self, "dropout"):
                self.dropout.build(x_shape)
            super().build(input_shape)

        def call(self, inputs: Any, training: bool = False) -> Any:
            x = inputs
            if self.expand_ratio != 1:
                x = self.expand_conv(x)
                x = self.expand_bn(x, training=training)
                x = keras.activations.swish(x)

            x = self.depthwise_conv(x)
            x = self.depthwise_bn(x, training=training)
            x = keras.activations.swish(x)
            x = self.se_block(x)
            x = self.project_conv(x)
            x = self.project_bn(x, training=training)

            if self.has_skip:
                if self.drop_connect_rate > 0:
                    x = self.dropout(x, training=training)
                x = x + inputs
            return x

        def get_config(self) -> dict[str, Any]:
            config = super().get_config()
            config.update(
                {
                    "filters": self.filters,
                    "kernel_size": self.kernel_size,
                    "strides": self.strides,
                    "expand_ratio": self.expand_ratio,
                    "se_ratio": self.se_ratio,
                    "drop_connect_rate": self.drop_connect_rate,
                    "input_filters": self.input_filters,
                }
            )
            return config

    class SEBlock(layers.Layer):
        def __init__(self, channels: int, se_ratio: float, **kwargs: Any) -> None:
            super().__init__(**kwargs)
            self.channels = channels
            self.se_ratio = se_ratio
            reduced_channels = max(1, int(channels * se_ratio))
            self.global_pool = layers.GlobalAveragePooling2D(name="global_pool")
            self.squeeze = layers.Dense(reduced_channels, activation="swish", name="squeeze")
            self.excite = layers.Dense(channels, activation="sigmoid", name="excite")

        def build(self, input_shape: Any) -> None:
            channels = int(input_shape[-1])
            self.global_pool.build(input_shape)
            self.squeeze.build((input_shape[0], channels))
            self.excite.build((input_shape[0], max(1, int(channels * self.se_ratio))))
            super().build(input_shape)

        def call(self, inputs: Any) -> Any:
            se = self.global_pool(inputs)
            se = self.squeeze(se)
            se = self.excite(se)
            se = ops.reshape(se, (-1, 1, 1, self.channels))
            return inputs * se

    return {"MBConvBlock": MBConvBlock}


def _conv_output_shape(input_shape: tuple[Any, ...], filters: int, strides: int) -> tuple[Any, ...]:
    batch, height, width, _channels = input_shape
    if height is not None:
        height = math.ceil(height / strides)
    if width is not None:
        width = math.ceil(width / strides)
    return (batch, height, width, filters)
