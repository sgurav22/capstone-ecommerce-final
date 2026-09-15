const API = 'https://fakestoreapi.com/products';
export async function fetchProducts() {
  const cached = localStorage.getItem('products_cache');
  const time = localStorage.getItem('cache_time');
  if (cached && time && Date.now() - time < 600000) return JSON.parse(cached);
  const res = await fetch(API);
  if (!res.ok) throw new Error('API failed');
  const data = await res.json();
  localStorage.setItem('products_cache', JSON.stringify(data));
  localStorage.setItem('cache_time', Date.now());
  return data;
}
