import { defineRouteConfig } from "@medusajs/admin-sdk";
import { MapPin } from "@medusajs/icons";
import { Badge, Container, Heading, Table, Text } from "@medusajs/ui";

const requiredVariables = [
  "NEXT_PUBLIC_SAMEDAY_CLIENT_ID",
  "NEXT_PUBLIC_SAMEDAY_API_USERNAME",
  "NEXT_PUBLIC_SAMEDAY_COUNTRY_CODE",
  "NEXT_PUBLIC_SAMEDAY_LANG_CODE",
];

const workflowRows = [
  ["Checkout", "Customer selects an easybox/PUDO locker before placing the order."],
  ["Order metadata", "Selected locker data is stored on the order delivery payload."],
  ["Fulfillment", "Carrier integration creates shipment/AWB from order and locker metadata."],
  ["Returns", "Return requests can be routed back to locker-supported fulfillment flows."],
];

const SamedayLockersPage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Sameday Lockers</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Locker setup for checkout delivery and fulfillment operations.
          </Text>
        </div>
        <Badge color="orange">credentials pending</Badge>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div>
          <Heading level="h2">Runtime variables</Heading>
          <Text className="text-ui-fg-subtle mt-1" size="small">
            Set these before enabling the production locker selector.
          </Text>
          <Table className="mt-4">
            <Table.Body>
              {requiredVariables.map((name) => (
                <Table.Row key={name}>
                  <Table.Cell className="font-mono text-ui-fg-base">
                    {name}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Badge color="grey">required</Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div>
          <Heading level="h2">Operational flow</Heading>
          <Text className="text-ui-fg-subtle mt-1" size="small">
            This is the carrier handoff we wire into Medusa fulfillment next.
          </Text>
          <Table className="mt-4">
            <Table.Body>
              {workflowRows.map(([step, description]) => (
                <Table.Row key={step}>
                  <Table.Cell className="font-medium">{step}</Table.Cell>
                  <Table.Cell className="text-ui-fg-subtle">
                    {description}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Sameday Lockers",
  icon: MapPin,
  rank: 40,
});

export default SamedayLockersPage;
