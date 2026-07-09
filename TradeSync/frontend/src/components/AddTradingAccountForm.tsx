import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradingAccountCreate } from "@/api/tradingAccounts";

interface AddTradingAccountFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddTradingAccountForm({ onSuccess, onCancel }: AddTradingAccountFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TradingAccountCreate>({
    defaultValues: {
      broker: "Upstox"
    }
  });

  const onSubmit = async (data: TradingAccountCreate) => {
    setIsSubmitting(true);
    try {
      const { createTradingAccount } = await import("@/api/tradingAccounts");
      await createTradingAccount(data);
      onSuccess();
    } catch (error) {
      console.error("Failed to add trading account", error);
      alert("Failed to add trading account. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="broker">Broker</Label>
        <Select onValueChange={(val) => setValue("broker", val)} defaultValue="Upstox">
          <SelectTrigger>
            <SelectValue placeholder="Select Broker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Upstox">Upstox</SelectItem>
            <SelectItem value="Zerodha" disabled>Zerodha (Coming Soon)</SelectItem>
            <SelectItem value="AngelOne" disabled>Angel One (Coming Soon)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="account_name">Account Nickname</Label>
        <Input 
          id="account_name" 
          placeholder="e.g. My Personal Upstox" 
          {...register("account_name", { required: "Nickname is required" })} 
        />
        {errors.account_name && <span className="text-sm text-red-500">{errors.account_name.message}</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile_number">Mobile Number (Optional)</Label>
        <Input 
          id="mobile_number" 
          placeholder="+91..." 
          {...register("mobile_number")} 
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Account"}
        </Button>
      </div>
    </form>
  );
}
