import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"


export default function DownloadBtn() {
    const navigate = useNavigate()

  return (
    <div className="flex gap-2">
      <Button onClick={() => navigate('/download')} variant="outline">
        <Download data-icon="inline-end" /> Download
      </Button>
    </div>
  )
}
