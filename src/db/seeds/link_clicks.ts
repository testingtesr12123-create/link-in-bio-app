import { db } from '@/db';
import { links, linkClicks } from '@/db/schema';

async function main() {
    // First, get all existing link IDs
    const existingLinks = await db.select().from(links);
    
    if (existingLinks.length === 0) {
        console.log('⚠️ No links found in database. Please seed links first.');
        return;
    }

    console.log(`📊 Found ${existingLinks.length} links. Generating 50 click records...`);

    const referrers = [
        'https://twitter.com',
        'https://instagram.com',
        'https://google.com',
        'direct',
        null,
    ];

    // Calculate date range (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Determine popular links (top 3 by ID get 60% of clicks)
    const popularLinkIds = existingLinks.slice(0, 3).map(link => link.id);
    const regularLinkIds = existingLinks.slice(3).map(link => link.id);

    // Calculate click distribution
    const popularClickCount = Math.floor(50 * 0.6); // 30 clicks
    const regularClickCount = 50 - popularClickCount; // 20 clicks

    const sampleLinkClicks = [];

    // Generate clicks for popular links (30 clicks, more recent)
    for (let i = 0; i < popularClickCount; i++) {
        const linkId = popularLinkIds[i % popularLinkIds.length];
        
        // More recent dates for popular links (last 15 days)
        const fifteenDaysAgo = new Date(now);
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        const daysBack = Math.floor(Math.random() * 15);
        const hoursBack = Math.floor(Math.random() * 24);
        const minutesBack = Math.floor(Math.random() * 60);
        
        const clickDate = new Date(now);
        clickDate.setDate(clickDate.getDate() - daysBack);
        clickDate.setHours(clickDate.getHours() - hoursBack);
        clickDate.setMinutes(clickDate.getMinutes() - minutesBack);

        // 30% chance of null referrer, otherwise pick from array
        const referrer = Math.random() < 0.3 
            ? null 
            : referrers[Math.floor(Math.random() * (referrers.length - 1))];

        sampleLinkClicks.push({
            linkId,
            clickedAt: clickDate.toISOString(),
            referrer,
        });
    }

    // Generate clicks for regular links (20 clicks, distributed across 30 days)
    if (regularLinkIds.length > 0) {
        for (let i = 0; i < regularClickCount; i++) {
            const linkId = regularLinkIds[i % regularLinkIds.length];
            
            // Distributed across full 30 days
            const daysBack = Math.floor(Math.random() * 30);
            const hoursBack = Math.floor(Math.random() * 24);
            const minutesBack = Math.floor(Math.random() * 60);
            
            const clickDate = new Date(now);
            clickDate.setDate(clickDate.getDate() - daysBack);
            clickDate.setHours(clickDate.getHours() - hoursBack);
            clickDate.setMinutes(clickDate.getMinutes() - minutesBack);

            // 30% chance of null referrer
            const referrer = Math.random() < 0.3 
                ? null 
                : referrers[Math.floor(Math.random() * (referrers.length - 1))];

            sampleLinkClicks.push({
                linkId,
                clickedAt: clickDate.toISOString(),
                referrer,
            });
        }
    }

    // Sort by date (oldest first)
    sampleLinkClicks.sort((a, b) => 
        new Date(a.clickedAt).getTime() - new Date(b.clickedAt).getTime()
    );

    await db.insert(linkClicks).values(sampleLinkClicks);
    
    console.log('✅ Link clicks seeder completed successfully');
    console.log(`📈 Generated ${sampleLinkClicks.length} click records`);
    console.log(`🔥 Popular links (${popularLinkIds.join(', ')}): ${popularClickCount} clicks`);
    console.log(`📊 Regular links: ${regularClickCount} clicks`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});