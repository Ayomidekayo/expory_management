import { Link } from "react-router-dom";
import { useContainers, useDeleteContainer } from "../../hooks/container/useContainers";

export default function ContainerListPage() {
  const deleteMutation = useDeleteContainer();
  const { data, isLoading } =
    useContainers({
      page: 1,
      limit: 20,
    });

  if (isLoading) {
    return <p>Loading...</p>;
  }
const handleDelete = async (id: string) => {

  const confirmed = window.confirm(
    "Delete this container?"
  );

  if (!confirmed) return;

  try {

    await deleteMutation.mutateAsync(id);

    alert("Container deleted successfully.");

  } catch (error) {

    alert("Unable to delete container.");

  }

};
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">
          Containers
        </h1>

        <Link
          to="/containers/create"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Add Container
        </Link>

      </div>

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-100">

            <th className="border p-2">
              Container
            </th>

            <th className="border p-2">
              Shipment
            </th>

            <th className="border p-2">
              Type
            </th>

            <th className="border p-2">
              Size
            </th>

            <th className="border p-2">
              Status
            </th>

            <th className="border p-2">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

         {Array.isArray(data) && data.map((container: any) => (


            <tr key={container.id}>

              <td className="border p-2">
                {container.containerNumber}
              </td>

              <td className="border p-2">
                {container.shipment.shipmentNumber}
              </td>

              <td className="border p-2">
                {container.containerType}
              </td>

              <td className="border p-2">
                {container.containerSize}
              </td>

              <td className="border p-2">
                {container.status}
              </td>

              <td className="border p-2">

               <td className="border p-2 space-x-3">

  <Link
    to={`/containers/${container.id}`}
    className="text-blue-600"
  >
    View
  </Link>

  <Link
    to={`/containers/${container.id}/edit`}
    className="text-green-600"
  >
    Edit
  </Link>

  <button
    onClick={() => handleDelete(container.id)}
    className="text-red-600"
  >
    Delete
  </button>

</td>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}