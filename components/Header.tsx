import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { HeaderBarProps } from "@/utils/interface";
import { useUserStore } from "@/store/userStore";

const Header: React.FC<HeaderBarProps> = ({ title }) => {
  const user = useUserStore((state) => state.user);

  return (
    <header className="bg-white py-4 px-6 flex items-center justify-between">
      <div className="w-10" />
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <Link href="/mypage" passHref>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer">
          {user && user.image_url ? (
            <Image
              src={user.image_url}
              alt="User profile"
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </Link>
    </header>
  );
};

export default Header;
