const news = [
  {
    id: 1,
    title: "The portfolio is now a working record",
    thumbnail: "",
    category: "Update",
    content: "A new editorial pass keeps the work, notes and links close to the surface.",
    published: true,
    created_at: "2025-07-15T09:00:00Z",
  },
  {
    id: 2,
    title: "VIREON library workspace shipped",
    thumbnail: "",
    category: "Project",
    content: "Collections, members, borrowing and reports now live in one focused digital workspace.",
    published: true,
    created_at: "2025-06-28T09:00:00Z",
  },
];
const comments = [
  {
    id: 1,
    username: "Alya",
    message: "The project notes make the process easy to follow.",
    pinned: true,
    created_at: "2025-07-12T10:00:00Z",
  },
  {
    id: 2,
    username: "Rafi",
    message: "Clean work. The library project is especially interesting.",
    pinned: false,
    created_at: "2025-07-10T10:00:00Z",
  },
];
const replies = [
  {
    id: 1,
    comment_id: 1,
    reply_text: "Thank you — glad the record is useful.",
    admin_name: "Reyhan",
    created_at: "2025-07-12T11:00:00Z",
  },
];

function query(table: string): any {
  const rows = table === "news" ? news : table === "comments" ? comments : table === "replies" ? replies : [];
  const result: any = {
    data: rows,
    error: null,
    count: table === "visitors" ? 1284 : rows.length,
    select: () => result,
    eq: () => result,
    order: () => result,
    gte: () => {
      result.count = 16;
      return result;
    },
    insert: (items: Record<string, unknown>[]) => {
      const row = {
        ...items[0],
        id: Date.now(),
        pinned: false,
        created_at: new Date().toISOString(),
      };
      return { select: async () => ({ data: [row], error: null }) };
    },
    then: (resolve: (value: unknown) => unknown) => Promise.resolve({
      data: rows,
      error: null,
      count: result.count,
    }).then(resolve),
  };
  return result;
}

export const supabase = { from: query };
