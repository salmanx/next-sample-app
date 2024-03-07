import { Button } from "@nextui-org/react";
import * as action from "@/actions";
import { auth } from "@/auth";
import Profile from "@/components/profile";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <form action={action.signIn} className="m-5">
        <Button type="submit">Singin</Button>
      </form>

      <form action={action.singOut} className="m-5">
        <Button type="submit">Signout</Button>
      </form>

      {session?.user ? JSON.stringify(session?.user) : "Signed out"}

      <Profile />
    </div>
  );
}
