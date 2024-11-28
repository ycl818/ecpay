import ECPayButton from "@/components/ECPayButton";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl mb-4">Order Summary</h2>
        <p className="mb-4">Item: Sample Product</p>
        <p className="mb-4">Amount: NT$1000</p>
        <ECPayButton amount={1000} itemName="Sample Product" />
      </div>
    </div>
  );
}

