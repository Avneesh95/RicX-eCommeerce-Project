import BulkUploadPanel from "../components/shared/BulkUploadPanel";

export default function AdminBulkUpload() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 sm:p-10">
      <BulkUploadPanel accentColor="indigo" />
    </div>
  );
}
