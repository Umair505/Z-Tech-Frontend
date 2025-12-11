import HomeView from "@/components/home/HomeView";

// Server-side Data Fetching
async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/products`, {
      cache: 'no-store' // Ensure we get fresh data on server load
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (

    <HomeView initialProducts={products} />
  );
}