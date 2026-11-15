
import { redirect } from "next/navigation";
import { getCurrentUser, deleteSession } from "@/app/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  async function handleSignOut() {
    "use server";

    await deleteSession();
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Welcome to Small Business Manager
        </h1>

        <p className="text-lg text-gray-700">
          Welcome, {user.name}!
        </p>

        <p className="mt-3 text-gray-600">
          You are successfully signed in.
        </p>

        <form action={handleSignOut} className="mt-6">
          <button
            type="submit"
            className="rounded-md bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700"
          >
            Sign Out
          </button>
        </form>
      </div>
    </main>
  );
}
