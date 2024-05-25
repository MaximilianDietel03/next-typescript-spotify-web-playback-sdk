import { useAuthContext } from "../auth/useAuthContext";

export const Header = () => {
  const { profile, login } = useAuthContext();

  return (
    <header className="absolute top-0 left-0 right-0 flex justify-between p-8">
      <div className="flex text-white text-lg sm:text-2xl font-bold">
        <h1>reading</h1><h1 className="text-green-500">mood</h1><h1>.</h1>
      </div>
      {profile ? (
        <p className="text-white text-xl">👾 Welcome back {profile.display_name}!</p>
      ) : (
        <button onClick={login} className="bg-green-500 rounded-full py-1 px-4 text-white font-medium hover:opacity-75">
          SIGN IN
        </button>
      )}
    </header>
  )
}