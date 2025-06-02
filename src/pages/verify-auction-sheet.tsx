export default function VerifyAuctionSheet() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white border-b-2 border-yellow-400 pb-2 inline-block mb-8">
        Authentic Auction Sheet Verification Of Japanese Cars
      </h1>

      <div className="max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Chassis No. EX: NKE165-7231825"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded">
            Verify
          </button>
        </div>
        <p className="mt-6 text-gray-200 text-xl font-medium">
          অকশনশিট ভ্যারিফিকেশন করতে আপনার চ্যাসিস নাম্বারটি সার্চ বারে লিখুন
          (উদাহরনঃ NKE165-7231825) এরপরে Verify বাটনটি ক্লিক করুন ।
        </p>

        <div className="mt-8 bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700">
          <p className="text-yellow-400 text-lg font-semibold mb-4">
            Just Enter the chassis number of your car to get original auction
            sheet only at BDT 780 Taka
          </p>
          <div className="text-gray-200 space-y-4">
            <p>
              গাড়িটির চ্যাসিস নাম্বারটি লিখে (যেমন: NKE165-7231825) সার্চ বাটনে
              ক্লিক করতে হবে।
            </p>
            <p>
              চ্যাসিস নাম্বার পাওয়া গেলে BUY বাটনে ক্লিক করে আপনার আপনার
              ইনফরমেশন গুলো দিয়ে ৭৮০ টাকা অনলাইন পেমেন্ট করতে হবে। সকল প্রসেস
              শেষ হলে সাথে সাথেই আপনার গাড়ির ১০০% জেনুইন অকশন শিটটি গাড়ির ছবি
              সহ দেখতে পাবেন। আপনার ইমেলেও একটি কপি পেয়ে যাবেন । ইমেল থেকে আপনি
              ফরম্যাট এ ডাউনলোড করে নিতে পারবেন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
