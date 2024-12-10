import ShippingTable from "@/components/ShippingTable";

export default function ShippingSchedulePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shipping Schedule</h1>
      <ShippingTable />
    </div>
  );
}
