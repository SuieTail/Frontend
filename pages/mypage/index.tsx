import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, ChevronRight, UserRound } from "lucide-react";
import Link from "next/link";

import { useWallet } from "@suiet/wallet-kit";
import { useUserStore } from "@/store/userStore";
import { fetchUser } from "@/utils/api/user";
import { fetchMyAIs } from "@/utils/api/ai";

interface AICardProps {
  ai_id: string;
  name: string;
  category: string;
  image_url?: string;
  introductions: string;
}
// AICard Component
const AICard: React.FC<AICardProps> = ({
  ai_id,
  name,
  category,
  image_url,
  introductions,
}) => {
  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              width={60}
              height={60}
              className="rounded-full mr-4"
            />
          ) : (
            <div className="size-[60px] rounded-full bg-emerald-100 mr-4 flex items-center justify-center">
              <span className="text-emerald-500 font-bold text-lg">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <span className="text-sm rounded-full bg-primary-50 text-primary-900 px-3 py-1">
              {category}
            </span>
          </div>
        </div>
        <button className="text-primary-900 font-medium text-lg flex items-center">
          Edit AI
        </button>
      </div>
    </div>
  );
};

// MyPage Component
const MyPage = () => {
  const [myAIs, setMyAIs] = useState<AICardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: storedUser, setUser } = useUserStore();
  const wallet = useWallet();

  const loadUserData = async () => {
    if (wallet.address) {
      try {
        const userData = await fetchUser(wallet.address);
        console.log("Fetched User Data:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!storedUser && wallet.address) {
      loadUserData(); // storedUser가 없을 때만 데이터를 불러옴
    } else {
      setIsLoading(false); // storedUser가 이미 있으면 바로 로딩 해제
    }
  }, [wallet.address, storedUser, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!storedUser) {
    return <div>User not found. Please connect your wallet.</div>;
  }

  return (
    <div className="flex flex-col px-2">
      <div className="flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center">
          <div className="size-20 bg-gray-200 rounded-full mr-4 mx-auto flex items-center justify-center overflow-hidden">
            {storedUser.image_url ? (
              <img
                src={storedUser.image_url}
                alt="Selected profile"
                className="w-full h-full object-cover transform scale-150 translate-y-[-10%]"
                />
            ) : (
              <UserRound className="text-gray-400 size-16" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{storedUser.nickname}</h2>
            <p className="text-gray-600">Gender: {storedUser.gender || ""}</p>
            <p className="text-gray-600">Country: {storedUser.country || ""}</p>
          </div>
        </div>
        <Link
          href="/editprofile"
          className="font-medium text-lg text-primary-900"
        >
          Edit <Pencil className="inline-block ml-1" size={18} />
        </Link>
      </div>

      <h3 className="text-xl font-semibold py-2">My AI</h3>
      <div>
        {myAIs.map((ai) => (
          <AICard key={ai.ai_id} {...ai} />
        ))}
      </div>
    </div>
  );
};

export default MyPage;

export async function getStaticProps() {
  return {
    props: {
      title: "My Page",
    },
  };
}
