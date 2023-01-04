import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  async getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: { userId },
    });
  }

  async getBookmarksById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });
  }

  async editBookmarksById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    // check if the user own the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access Denied');

    return this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });
  }

  async deleteBookmarksById(userId: number, bookmarkId: number) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    // check if the user own the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access Denied');

    await this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
