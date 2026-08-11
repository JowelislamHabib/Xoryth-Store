import { getSession } from "@/lib/session";
import { ProfileForm } from "@/components/account/profile-form";

export default async function AccountPage() {
  const session = (await getSession())!;

  return <ProfileForm session={session} />;
}
