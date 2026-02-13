import { Fragment } from "react"; // like <></> same but if use fragment can add key or attribute

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-w-full flex-col items-center justify-center gap-10">
      <Fragment> 
        <section className="max-w-screen-3xl 3xl:container p-6">
          {children}
        </section>
      </Fragment>
    </div>
  );
}
