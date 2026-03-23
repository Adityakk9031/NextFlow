import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-full items-center justify-center bg-[#0d0d0d]">
      <SignIn
        appearance={{
          elements: {
            rootBox: "bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl",
            card: "bg-[#1a1a1a]",
            headerTitle: "text-white",
            headerSubtitle: "text-[#888]",
            socialButtonsBlockButton:
              "bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#333]",
            formFieldInput:
              "bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#888]",
            formFieldLabel: "text-[#aaa]",
            footerActionLink: "text-indigo-400 hover:text-indigo-300",
            formButtonPrimary:
              "bg-indigo-600 hover:bg-indigo-500 text-white",
          },
        }}
      />
    </div>
  );
}
