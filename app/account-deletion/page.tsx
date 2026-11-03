import { redirect } from "next/navigation";

export default function AccountDeletionRedirectPage() {
  redirect("/policies/data-deletion");
}

