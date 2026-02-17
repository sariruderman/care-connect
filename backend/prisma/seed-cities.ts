import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CITIES_DATA = [
  {
    name: 'תל אביב',
    neighborhoods: ['רמת אביב', 'צפון ישן', 'פלורנטין', 'נווה צדק', 'יפו', 'רמת החייל'],
  },
  {
    name: 'ירושלים',
    neighborhoods: ['גאולה', 'מאה שערים', 'רמות', 'גבעת שאול', 'בית וגן', 'קטמון'],
  },
  {
    name: 'בני ברק',
    neighborhoods: ['פרדס כץ', 'עזרא', 'רמת אלחנן', 'כפר אברהם', 'רמת אהרון'],
  },
  {
    name: 'פתח תקווה',
    neighborhoods: ['קרית אריה', 'נווה גנים', 'עין גנים', 'סגולה', 'כפר גנים'],
  },
  {
    name: 'רמת גן',
    neighborhoods: ['רמת אפעל', 'רמת חן', 'תל בנימין', 'קרית בורוכוב', 'רמת יצחק'],
  },
  {
    name: 'חולון',
    neighborhoods: ['תל גיבורים', 'קרית שרת', 'נווה רמז', 'קרית בן גוריון'],
  },
  {
    name: 'ראשון לציון',
    neighborhoods: ['שיכון ותיקים', 'נווה דקלים', 'רמת אליהו', 'נאות אשכול'],
  },
  {
    name: 'אשדוד',
    neighborhoods: ['גבעת יונה', 'רובע ז', 'רובע יא', 'רובע טז'],
  },
  {
    name: 'נתניה',
    neighborhoods: ['קרית השרון', 'רמת פולג', 'נאות גולדה', 'קרית נורדאו'],
  },
  {
    name: 'באר שבע',
    neighborhoods: ['רמות', 'נווה זאב', 'נווה נוי', 'רמת בקע'],
  },
];

async function main() {
  console.log('Starting seed...');

  for (const cityData of CITIES_DATA) {
    const city = await prisma.city.upsert({
      where: { name: cityData.name },
      update: {},
      create: { name: cityData.name },
    });

    console.log(`Created/Updated city: ${city.name}`);

    for (const neighborhoodName of cityData.neighborhoods) {
      await prisma.neighborhood.upsert({
        where: {
          cityId_name: {
            cityId: city.id,
            name: neighborhoodName,
          },
        },
        update: {},
        create: {
          name: neighborhoodName,
          cityId: city.id,
        },
      });
    }

    console.log(`  Added ${cityData.neighborhoods.length} neighborhoods`);
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
