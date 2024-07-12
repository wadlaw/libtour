import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Libtour - Sign in",
  description: "A Summer-long series of events at Redlibbets",
};

export default function SignInPage() {
  return (
    <div className="flex justify-center py-24">
      <SignIn />
    </div>
  );
}
