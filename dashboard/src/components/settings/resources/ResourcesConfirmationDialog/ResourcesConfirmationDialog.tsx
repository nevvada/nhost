import useProPlan from '@/hooks/common/useProPlan';
import { Alert } from '@/ui/Alert';
import Box from '@/ui/v2/Box';
import Button from '@/ui/v2/Button';
import Divider from '@/ui/v2/Divider';
import Text from '@/ui/v2/Text';
import { RESOURCE_VCPU_PRICE } from '@/utils/CONSTANTS';

export interface ResourcesConfirmationDialogProps {
  /**
   * Price of the new plan.
   */
  updatedResources: {
    vcpu: number;
    memory: number;
  };
  /**
   * Function to be called when the user clicks the cancel button.
   */
  onCancel: () => void;
  /**
   * Function to be called when the user clicks the confirm button.
   */
  onSubmit: () => void;
}

export default function ResourcesConfirmationDialog({
  updatedResources,
  onCancel,
  onSubmit,
}: ResourcesConfirmationDialogProps) {
  const { data: proPlan, loading, error } = useProPlan();
  const updatedPrice = RESOURCE_VCPU_PRICE * updatedResources.vcpu;

  if (!loading && !proPlan) {
    return (
      <Alert severity="error">
        Couldn&apos;t load the plan for this project. Please try again.
      </Alert>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <div className="grid grid-flow-row gap-6 px-6 pb-6">
      {updatedResources.vcpu > 0 ? (
        <Text className="text-center">
          Please allow some time for the additional resources to appear.
        </Text>
      ) : (
        <Text className="text-center">
          By confirming this you will go back to the original amount of
          resources of the {proPlan.name} plan.
        </Text>
      )}

      <Box className="grid grid-flow-row gap-4">
        <Box className="grid grid-flow-col justify-between gap-2">
          <Text className="font-medium">{proPlan.name} Plan</Text>
          <Text>${proPlan.price.toFixed(2)}/mo</Text>
        </Box>

        <Box className="grid grid-flow-col items-center justify-between gap-2">
          <Box className="grid grid-flow-row gap-0.5">
            <Text className="font-medium">Dedicated Resources</Text>
            <Text className="text-xs" color="secondary">
              {updatedResources.vcpu} vCPUs + {updatedResources.memory} GiB of
              Memory
            </Text>
          </Box>
          <Text>${updatedPrice.toFixed(2)}/mo</Text>
        </Box>

        <Divider />

        <Box className="grid grid-flow-col justify-between gap-2">
          <Text className="font-medium">Total</Text>
          <Text>${(updatedPrice + proPlan.price).toFixed(2)}/mo</Text>
        </Box>
      </Box>

      <Box className="grid grid-flow-row gap-2">
        <Button
          color={updatedResources.vcpu > 0 ? 'primary' : 'error'}
          onClick={onSubmit}
        >
          Confirm
        </Button>

        <Button variant="borderless" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </div>
  );
}
