import { getLongUrl } from "@/db/apiUrls";
import storeClicks from "@/db/apiClicks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirect = async () => {
      try {
        const data = await getLongUrl(id);

        if (!data || !data.original_url) {
          setError("URL not found");
          setLoading(false);
          return;
        }

        // Fire-and-forget click recording
        storeClicks({ id: data.id, originalUrl: data.original_url });

        // Redirect immediately
        window.location.href = data.original_url;
      } catch (err) {
        console.error(err);
        setError("Failed to redirect");
        setLoading(false);
      }
    };

    redirect();
  }, [id]);

  if (loading) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return null;
};

export default RedirectLink;
