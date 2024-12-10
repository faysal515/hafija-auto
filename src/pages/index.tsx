import ShippingTable from "../components/ShippingTable";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4 mt-8">Shipping Schedule</h2>
      <ShippingTable />
    </div>
  );
}
