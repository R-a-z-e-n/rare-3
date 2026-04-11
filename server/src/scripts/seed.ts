import { productModel } from '../models/productModel';
import { serviceModel } from '../models/serviceModel';
import { userModel } from '../models/userModel';
import bcrypt from 'bcryptjs';

const seed = async () => {
  console.log('Seeding products...');
  const products = [
    { brand: 'Aesop', name: 'Resurrection Hand Balm', image: 'https://images.unsplash.com/photo-1643379850623-7eb6442cd262?w=600&q=80', price: 28, category: 'Body', rating: 4.8 },
    { brand: 'Tatcha', name: 'The Dewy Skin Cream', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', price: 68, category: 'Skincare', rating: 4.9 },
    { brand: 'La Mer', name: 'The Concentrate', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', price: 450, category: 'Skincare', rating: 5.0 },
    { brand: 'Byredo', name: 'Gypsy Water EDP', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80', price: 180, category: 'Fragrance', rating: 4.7 },
  ];

  for (const product of products) {
    const existing = await productModel.list(product.category);
    if (!existing.some(p => p.name === product.name)) {
      await productModel.create({
        ...product,
        description: 'A rich, moisturizing cream with plumping hydration and antioxidant-packed Japanese purple rice for a dewy, healthy glow.',
        ingredients: 'Aqua/Water/Eau, Saccharomyces/Camellia Sinensis Leaf/Cladosiphon Okamuranus/Rice Ferment Filtrate, Glycerin, Rice Germ Oil...',
        usage: 'Scoop a pearl-sized amount of cream with the gold spoon. Massage onto face, neck, and décolletage in upward strokes. Use daily, morning and night.',
        stock: 100
      });
    }
  }

  // Seed Services
  console.log('Seeding services...');
  const services = [
    { name: 'Lume Wellness Spa', location: 'Beverly Hills, CA', address: '9876 Wilshire Blvd, Beverly Hills, CA 90210', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', tags: 'Massage, Facial', price: '₹180', rating: 4.9, category: 'Spa' },
    { name: 'Serenity Yoga Studio', location: 'Santa Monica, CA', address: '1250 Ocean Park Blvd, Santa Monica, CA 90405', image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80', tags: 'Yoga, Meditation', price: '₹45', rating: 5.0, category: 'Yoga' },
    { name: 'Atelier Beauty Lounge', location: 'West Hollywood, CA', address: '8720 Sunset Blvd, West Hollywood, CA 90069', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80', tags: 'Hair, Nails', price: '₹95', rating: 4.8, category: 'Spa' },
    { name: 'Zen Meditation Center', location: 'Culver City, CA', address: '9876 Venice Blvd, Culver City, CA 90232', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', tags: 'Zen, Mindfulness', price: '₹30', rating: 5.0, category: 'Meditations' },
  ];

  for (const service of services) {
    const existing = await serviceModel.list(service.category);
    if (!existing.some(s => s.name === service.name)) {
      await serviceModel.create(service);
    }
  }

  // Seed Admin User
  console.log('Seeding admin user...');
  const existingAdmin = await userModel.findByEmail('admin@rare.com');
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userModel.create({
      name: 'Admin User',
      email: 'admin@rare.com',
      password: hashedPassword,
      role: 'admin',
      membership: 'Elite',
      points: 1000
    });
  }

  console.log('Seeding completed successfully');
  process.exit(0);
};

seed().catch(err => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
