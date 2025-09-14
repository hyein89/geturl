export default function Home() {
// render halaman 404 custom ketika seseorang membuka root domain
return (
<main style={{fontFamily:'system-ui,Segoe UI,Roboto',display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
<h1 style={{fontSize:32,marginBottom:8}}>404 — Not Found</h1>
<p style={{opacity:0.8}}>Halaman utama tidak tersedia. Coba buka URL ter-encode.</p>
</main>
);
}


export async function getServerSideProps() {
return {
notFound: true
};
}
