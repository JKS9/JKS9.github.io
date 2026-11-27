import { feedResponse } from '../utils/feed';

// Summary feed: the title and the "In short" text of each issue (see src/utils/feed.ts).
export const GET = (context) => feedResponse(context, 'summary');
