'use server';

import connectDB, { mongoConfigured } from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

async function getUnreadMessageCount() {
  if (!mongoConfigured()) return { count: 0 };
  const ready = await connectDB();
  if (!ready) return { count: 0 };

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.user) {
    return { error: 'User ID is required' };
  }

  const { userId } = sessionUser;

  const count = await Message.countDocuments({
    recipient: userId,
    read: false,
  });

  return { count };
}

export default getUnreadMessageCount;
