import { useRouter } from "next/router";
import { ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { AICardProps } from "@/utils/interface";
import { useEffect, useState } from "react";
import { fetchAIDetails } from "@/utils/api/ai";

export const AICard = ({
  id,
  name,
  creator,
  category,
  introductions,
  imageSrc,
}: AICardProps) => {
  const router = useRouter();

  const handleChatClick = () => {
    router.push(`/ai/${id}/chat`);
  };

  const [aiDetail, setAIDetail] = useState<any>();
  const [detailLoading, setDetailLoading] = useState(true);

  useEffect(() => {
    const loadAIModels = async () => {
      try {
        const data = await fetchAIDetails(id);
        setAIDetail(data);
        setDetailLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    loadAIModels();
  }, []);
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center flex-grow cursor-pointer">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={name}
                width={50}
                height={50}
                className="rounded-full mr-4"
              />
            ) : (
              <div className="w-[50px] h-[50px] rounded-full bg-primary-900 mr-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-gray-600">{creator}</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 max-h-[80vh] overflow-y-auto">
          {detailLoading ? (
            <div></div>
          ) : (
            <div className="space-y-4">
            <div className="flex justify-center pt-5">
              <div className="inline-block px-3 py-1 bg-primary-50 text-primary-900 rounded-full text-sm">
                {aiDetail.category}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary-900 text-center">
              {aiDetail.name}
            </h2>
            <p className="text-gray-500 text-center">Created by {name}</p>
            <p className="text-gray-500 text-center">
              Avarage Token Usage : 
              <span className="text-black font-bold">          
                {Math.round(
                (aiDetail.prompt_tokens + aiDetail.completion_tokens) /
                  (aiDetail.chat_counts || 1),
              )}
              </span>
            </p>
    
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-700 text-sm text-center">{aiDetail.introductions}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-gray-700 border-b">RAG</h3>
              <p className="text-sm text-gray-600">
                {aiDetail.logs.length > 0
                  ? aiDetail.logs[0].comments
                  : "No RAG information available."}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-gray-700 border-b">Comment</h3>
              <p className="text-sm text-gray-600">
                {aiDetail.logs.length > 1
                  ? aiDetail.logs[1].comments
                  : "No comments available."}
              </p>
            </div>
    
            <div className="p-4 bg-white border-t">
                <button
                  className="w-full py-4 bg-primary-900 text-white font-bold text-[18px] hover:bg-primary-700 rounded-full flex items-center justify-center"
                  onClick={handleChatClick}
                >
                  Start Chat!
                </button>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>

      <button
        className="px-4 py-2 bg-primary-50 text-primary-900 rounded-full hover:bg-primary-700 transition-colors flex items-center ml-4"
        onClick={handleChatClick}
      >
        Chat
        <ChevronRight className="ml-1" size={18} />
      </button>
    </div>
  );
};
