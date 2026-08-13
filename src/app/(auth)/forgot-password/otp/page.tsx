import Otp from "@/components/module/Auth/otp";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Banner Image */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/fgp.jpg')",
          }}
        />
      </div>

      {/* Right Form Content */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-white">
        <Otp />
      </div>
    </div>
  );
}

