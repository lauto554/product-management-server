import db, { connectDB } from '../config/db';

jest.mock('../config/db');

describe('connectDB', () => {
  test('should handle database connection error', async () => {
    jest
      .spyOn(db, 'authenticate')
      .mockRejectedValueOnce(new Error('Have an error connecting to the DB'));
    const consoleSpy = jest.spyOn(console, 'log');

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Have an error connecting to the DB')
    );
  });
});
