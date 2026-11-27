import { feedResponse } from '../utils/feed';

// Full-text feed: every issue in full (see src/utils/feed.ts). The /rss/ page explains it to humans.
export const GET = (context) => feedResponse(context, 'full');
