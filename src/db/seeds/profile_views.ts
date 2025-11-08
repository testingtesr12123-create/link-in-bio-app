import { db } from '@/db';
import { profileViews, users } from '@/db/schema';

async function main() {
    // Fetch existing user IDs
    const existingUsers = await db.select({ id: users.id }).from(users);
    
    if (existingUsers.length === 0) {
        console.error('❌ No users found. Please run users seeder first.');
        return;
    }

    const userIds = existingUsers.map(u => u.id);
    
    // Helper function to get random date in last 30 days
    const getRandomDate = (daysAgo: number) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        date.setSeconds(Math.floor(Math.random() * 60));
        return date.toISOString();
    };

    // Helper function to get random user ID
    const getRandomUserId = () => userIds[Math.floor(Math.random() * userIds.length)];

    // Device type distribution
    const getDeviceType = () => {
        const rand = Math.random();
        if (rand < 0.50) return 'mobile';
        if (rand < 0.85) return 'desktop';
        if (rand < 0.95) return 'tablet';
        return null;
    };

    // Referrer distribution
    const getReferrer = () => {
        const referrers = [
            'https://twitter.com',
            'https://instagram.com',
            'https://google.com',
            'direct',
            null
        ];
        return referrers[Math.floor(Math.random() * referrers.length)];
    };

    const sampleProfileViews = [
        // Recent views (last 3 days) - 40% of total (12 views)
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(0),
            referrer: 'https://twitter.com',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(0),
            referrer: 'https://instagram.com',
            deviceType: 'desktop'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(1),
            referrer: 'https://google.com',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(1),
            referrer: 'direct',
            deviceType: 'desktop'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(1),
            referrer: null,
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(2),
            referrer: 'https://twitter.com',
            deviceType: 'tablet'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(2),
            referrer: 'https://instagram.com',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(2),
            referrer: 'https://google.com',
            deviceType: 'desktop'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(2),
            referrer: 'direct',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(3),
            referrer: 'https://twitter.com',
            deviceType: 'desktop'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(3),
            referrer: null,
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(3),
            referrer: 'https://instagram.com',
            deviceType: 'tablet'
        },

        // Mid-range views (4-14 days) - 40% of total (12 views)
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(5),
            referrer: 'https://google.com',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(6),
            referrer: 'https://twitter.com',
            deviceType: 'desktop'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(7),
            referrer: 'direct',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(8),
            referrer: 'https://instagram.com',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(9),
            referrer: null,
            deviceType: 'desktop'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(10),
            referrer: 'https://google.com',
            deviceType: 'tablet'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(11),
            referrer: 'https://twitter.com',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(12),
            referrer: 'direct',
            deviceType: 'desktop'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(13),
            referrer: 'https://instagram.com',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(13),
            referrer: 'https://google.com',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(14),
            referrer: null,
            deviceType: null
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(14),
            referrer: 'https://twitter.com',
            deviceType: 'desktop'
        },

        // Older views (15-30 days) - 20% of total (6 views)
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(16),
            referrer: 'direct',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(18),
            referrer: 'https://instagram.com',
            deviceType: 'desktop'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(21),
            referrer: 'https://google.com',
            deviceType: 'mobile'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(24),
            referrer: 'https://twitter.com',
            deviceType: 'tablet'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(27),
            referrer: null,
            deviceType: 'desktop'
        },
        {
            userId: getRandomUserId(),
            viewedAt: getRandomDate(29),
            referrer: 'direct',
            deviceType: 'mobile'
        }
    ];

    await db.insert(profileViews).values(sampleProfileViews);
    
    console.log('✅ Profile views seeder completed successfully');
    console.log(`   Generated ${sampleProfileViews.length} profile view records`);
    console.log(`   Distributed across ${userIds.length} users`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});