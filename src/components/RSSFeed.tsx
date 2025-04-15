import React, { useEffect, useState } from "react";
import axios from "axios";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  thumbnail: string;
}

const RSSFeed: React.FC = () => {
  const [items, setItems] = useState<RSSItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await axios.get(
          "https://cors-anywhere.herokuapp.com/https://vietnamnet.vn/rss/the-thao.rss",
          {
            headers: { "Content-Type": "application/xml" }
          }
        );

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        const itemsArray: RSSItem[] = Array.from(
          xmlDoc.querySelectorAll("item")
        ).map((item) => {
          const description =
            item.querySelector("description")?.textContent || "";
          const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
          const thumbnail = imgMatch ? imgMatch[1] : "";

          return {
            title: item.querySelector("title")?.textContent || "No title",
            link: item.querySelector("link")?.textContent || "#",
            description,
            pubDate: item.querySelector("pubDate")?.textContent || "No date",
            thumbnail
          };
        });

        console.log("RSS items:", itemsArray); // Debug dữ liệu
        setItems(itemsArray);
      } catch (err) {
        setError("Không thể lấy dữ liệu RSS.");
        console.error(err);
      }
    };

    fetchRSS();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">
        RSS Feed - Vietnamnet Thể Thao
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={
                item.thumbnail ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {item.title}
              </a>
              <p className="text-sm text-gray-500 mt-2">{item.pubDate}</p>
              <p className="text-gray-700 mt-2 line-clamp-3">
                {item.description.replace(/<[^>]+>/g, "")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RSSFeed;
