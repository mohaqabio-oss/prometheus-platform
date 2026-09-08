import { redirect } from "next/navigation";

export default function LegacyEditorialMembersRedirect() {
  redirect("/admin/post/editorial");
}
