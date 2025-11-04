import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Props {
  params: { slug: string };
}

export default async function DetailBerita({ params }: Props) {
  const { data } = await supabase
    .from("berita")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!data) {
    return <p className="text-center mt-20">Berita tidak ditemukan.</p>;
  }

  return (
    <article className="max-w-4xl mx-auto py-16 px-6">
      <Image
        src={data.thumbnail_url}
        alt={data.title}
        className="w-full h-96 object-cover rounded-xl mb-6"
        width={800}
        height={600}
      />
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <p className="text-gray-500 mb-8">{data.created_at.slice(0, 10)}</p>
      <div
        className="prose prose-lg text-gray-800"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </article>
  );
}
