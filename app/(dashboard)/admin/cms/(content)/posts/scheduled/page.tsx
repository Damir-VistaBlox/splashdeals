import { redirect } from "next/navigation";

/** Legacy route — scheduled posts live as a list filter. */
export default function ScheduledPostsRedirectPage() {
  redirect("/admin/cms/posts?status=scheduled");
}
