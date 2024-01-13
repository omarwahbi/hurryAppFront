import Link from "next/link";
import "./styles.css";

export default function Home() {
  return (
    <div className=" h-dvh flex justify-center flex-wrap flex-col items-center container p-6">
      <h1 className="text-3xl mb-4 lg:text-5xl"> Welcome to Stream Spectra</h1>
      <p className="desc text-justify">
        Share, control, enjoy – your ultimate shared movie experience!
      </p>
      <Link
        href="/signIn"
        className=" m-5 p-5 flex lg:w-1/5 w-2/4 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <button type="submit">Sign in</button>
      </Link>
      <Link
        href="/register"
        className="flex lg:w-1/5 w-2/4 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <button type="submit">Register</button>
      </Link>
    </div>
  );
}
