import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Service Types
  const serviceTypes = [
    {
      id: BigInt(1),
      name: 'Barber Shop',
      description: 'Professional barber services including haircuts, shaves, and beard grooming',
      icon: '💈',
    },
    {
      id: BigInt(2),
      name: 'Spa',
      description: 'Relaxation and wellness services including massages, facials, and treatments',
      icon: '🧖',
    },
    {
      id: BigInt(3),
      name: 'Hair Salon',
      description: 'Professional hair styling, coloring, and treatment services',
      icon: '💇',
    },
    {
      id: BigInt(4),
      name: 'Nail Salon',
      description: 'Manicure, pedicure, and nail art services',
      icon: '💅',
    },
    {
      id: BigInt(5),
      name: 'Beauty Salon',
      description: 'Comprehensive beauty services including makeup and skincare',
      icon: '💄',
    },
    {
      id: BigInt(6),
      name: 'Massage Therapy',
      description: 'Therapeutic and relaxation massage services',
      icon: '💆',
    },
    {
      id: BigInt(7),
      name: 'Fitness Center',
      description: 'Gym, personal training, and fitness class services',
      icon: '🏋️',
    },
    {
      id: BigInt(8),
      name: 'Dental Clinic',
      description: 'Dental care and oral health services',
      icon: '🦷',
    },
    {
      id: BigInt(9),
      name: 'Medical Clinic',
      description: 'General medical consultation and health services',
      icon: '⚕️',
    },
    {
      id: BigInt(10),
      name: 'Auto Service',
      description: 'Vehicle maintenance and repair services',
      icon: '🚗',
    },
  ];

  console.log('Seeding service types...');

  for (const serviceType of serviceTypes) {
    await prisma.serviceType.upsert({
      where: { id: serviceType.id },
      update: {
        name: serviceType.name,
        description: serviceType.description,
        icon: serviceType.icon,
      },
      create: {
        id: serviceType.id,
        userId: BigInt(1), // Default system user
        name: serviceType.name,
        description: serviceType.description,
        icon: serviceType.icon,
        status: 0,
      },
    });
    console.log(`✓ Service type created/updated: ${serviceType.name}`);
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });