<script setup lang="ts">
import * as z from "zod";

// const { form, errors, notification, isLoading, submitForm, clearNotification } = useAuthForm(
//   {
//     email: "",
//     businessName: "",
//     mainContact: "",
//     addressLine: "",
//     city: "",
//     county: "",
//     country: "",
//     postcode: "",
//     registrationNumber: "",
//   },
//   "agent"
// );

const schema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  businessName: z.string().nonempty("Business name is required"),
  mainContact: z.string().nonempty("Main contact number is required"),
  addressLine: z.string().nonempty("Address line is required"),
  city: z.string().nonempty("City is required"),
  county: z.string().nonempty("County is required"),
  country: z.string().nonempty("Country is required"),
  postcode: z.string().optional(),
  registrationNumber: z.string().nonempty("Registration number is required"),
})

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: "",
  businessName: "",
  mainContact: "",
  addressLine: "",
  city: "",
  county: "",
  country: "",
  postcode: "",
  registrationNumber: "",
});

const stepper = useTemplateRef("stepper");

const formStep = ref([
  {
    slot: "personalInformation",
    title: "Personal Information",
    icon: "i-lucide-user",
  },
  {
    slot: "businessInformation",
    title: "Busiess Information",
    icon: "i-lucide-briefcase",
  },
  {
    slot: "businessAddress",
    title: "Buisness Address",
    icon: "i-lucide-map-pin",
  },
]);

/**
 * Signup function
 */
// async function signup() {
//   await submitForm("/auth/signup", "Signup successful! Approving your account, We will email you once your account is approved...");
// }

async function signup() {
  console.log(state)
}

/**
 * Clear notification handler
 */
// function clearNotificationHandler() {
//   clearNotification("/agent/login");
// }
</script>

<template>
  <div class="flex justify-center items-center bg-purple-500 h-screen">
    <div class="flex justify-center items-center w-1/2 h-full bg-white py-12 xs:w-full sm:w-1/2">
      <div class="p-8 flex justify-center flex-col sm:w-3/4 xs:w-full">
        <h1 class="text-3xl font-bold mb-6 text-purple-500">Agency Signup</h1>
        <h3 class="text-xl font-bold mb-6 text-purple-500">Once you have signed up to Virify, we will verify you and then you can start adding agents to your Agency Account!</h3>
        <UForm @submit="signup" :state="state" class="w-full">
          <UStepper color="neutral" ref="stepper" :items="formStep" size="sm" class="w-full">
            <template #personalInformation>
              <UFormField label="Email Address" name="email" size="lg" hint="Required" class="py-2" help="Your business email">
                <UInput v-model="state.email" type="email" placeholder="Enter your email..." size="xl" class="w-full" autocomplete="on" required />
              </UFormField>
              <UFormField label="Main Contact Number" name="mainContact" size="lg" hint="Required" class="py-2" help="The number to reach you on">
                <UInput v-model="state.mainContact" type="tel" placeholder="Enter your contact number" size="xl" class="w-full" required />
              </UFormField>
            </template>
            <template #businessInformation>
              <UFormField label="Business Name" name="businessName" size="lg" hint="Required" class="py-2" help="Your operating name">
                <UInput v-model="state.businessName" type="text" placeholder="Business name..." size="xl" class="w-full" required />
              </UFormField>
              <UFormField label="Company Registration Number" name="registrationNumber" size="lg" hint="Required" class="py-2" help="Your operating company registration number">
                <UInput v-model="state.registrationNumber" type="number" placeholder="Business registration number..." size="xl" class="w-full" required />
              </UFormField>
            </template>
            <template #businessAddress>
              <UFormField label="Business Address" name="addressLine" size="lg" hint="Required" class="py-2">
                <UInput v-model="state.addressLine" type="text" placeholder="Address line 1..." size="xl" class="w-full" required />
              </UFormField>
              <UFormField label="City" name="city" size="lg" hint="Required" class="py-2">
                <UInput v-model="state.city" type="text" placeholder="City..." size="xl" class="w-full" required />
              </UFormField>
              <UFormField label="County" name="county" size="lg" hint="Required" class="py-2">
                <UInput v-model="state.county" type="text" placeholder="County..." size="xl" class="w-full" required />
              </UFormField>
              <UFormField label="Country" name="country" size="lg" hint="Required" class="py-2">
                <UInput v-model="state.country" type="text" placeholder="Country..." size="xl" class="w-full" required />
              </UFormField>
              <UFormField label="Postcode" name="postcode" size="lg" hint="Required" class="py-2">
                <UInput v-model="state.postcode" type="text" placeholder="Postcode..." size="xl" class="w-full" />
              </UFormField>
            </template>
          </UStepper>
          <div class="flex gap-2 justify-between mt-4">
            <UButton leading-icon="i-lucide-arrow-left" :disabled="!stepper?.hasPrev" @click="stepper?.prev()" color="neutral"> Prev </UButton>
            <UButton trailing-icon="i-lucide-arrow-right" :disabled="!stepper?.hasNext" @click="stepper?.next()" color="neutral"> Next </UButton>
          </div>
          <UButton type="submit" loading-auto size="xl" class="text-white mt-4" variant="solid" active> Submit </UButton>
        </UForm>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-purple-500 h-full xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-5xl italic p-4 text-center">For Agents</h2>
    </div>
  </div>
</template>
