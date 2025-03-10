<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
const { showToast } = useToastNotification();

// personal, business and address schemas
const personalSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  mainContact: z.string().nonempty("Main contact number is required"),
});

const businessSchema = z.object({
  businessName: z.string().nonempty("Business name is required"),
  registrationNumber: z.string().nonempty("Registration number is required"),
});

const addressSchema = z.object({
  addressLine: z.string().nonempty("Address line is required"),
  city: z.string().nonempty("City is required"),
  county: z.string().nonempty("County is required"),
  country: z.string().nonempty("Country is required"),
  postcode: z.string().nonempty("Postcode is required"),
});

// Define type for each schema
type PersonalSchema = z.output<typeof personalSchema>;
type BusinessSchema = z.output<typeof businessSchema>;
type AddressSchema = z.output<typeof addressSchema>;

// Reactive form state
const state = reactive<Partial<PersonalSchema & BusinessSchema & AddressSchema>>({
  email: "",
  mainContact: "",
  businessName: "",
  registrationNumber: "",
  addressLine: "",
  city: "",
  county: "",
  country: "",
  postcode: "",
});

// refs
const stepper = useTemplateRef("stepper");
const form = useTemplateRef("form");

// Form steps configuration
const formStep = ref([
  { slot: "personalInformation", title: "Personal Information", icon: "i-lucide-user" },
  { slot: "businessInformation", title: "Business Information", icon: "i-lucide-briefcase" },
  { slot: "businessAddress", title: "Business Address", icon: "i-lucide-map-pin" },
]);

/**
 * Submit handler
 *
 * @param event FormSubmitEvent
 */
async function onSubmit(event: FormSubmitEvent<any>) {
  // You can handle the form submission here

  await $fetch("/auth/signup", {
    method: "POST",
    body: {
      ...state,
      role: "agent",
    },
  })
    .then(() => {
      // redirect to account page
      navigateTo("/agent");
    })
    .catch((error) => {
      showToast({ title: error.statusMessage, icon: "ri:error-warning-line" });
    });
}

/**
 * Next step handler
 * Validate the current form step and move to the next step
 */
async function nextStep() {
  try {
    if (form.value) {
      await form.value.validate({ nested: true });
      stepper.value?.next();
    }
    // need to catch error and return to prevent the stepper from moving
  } catch (error) {
    return;
  }
}

/**
 * Previous step handler
 * Move to the previous step
 */
async function prevStep() {
  stepper.value?.prev();
}

/**
 * Disable button if there are errors or if the stepper has a next step
 * Forces user to fill out the form before moving to the next step
 */
function submitState() {
  const isPersonalValid = !personalSchema.safeParse(state).error;
  const isBusinessValid = !businessSchema.safeParse(state).error;
  const isAddressValid = !addressSchema.safeParse(state).error;

  return !(isPersonalValid && isBusinessValid && isAddressValid);
}
</script>

<template>
  <div class="flex justify-center items-center bg-purple-500 h-screen">
    <div class="flex justify-center items-center w-1/2 h-full bg-white py-12 xs:w-full sm:w-1/2">
      <div class="p-8 flex justify-center flex-col sm:w-3/4 xs:w-full">
        <h1 class="text-3xl font-bold mb-6 text-purple-500">Agency Signup</h1>
        <h3 class="text-md font-bold mb-6 text-purple-500">Once you have signed up to Virify, we will verify you and then you can start adding agents to your Agency Account!</h3>

        <!-- start of form -->
        <UForm @submit="onSubmit" :state="state" class="w-full" ref="form">
          <!-- Stepper -->
          <UStepper ref="stepper" :items="formStep" size="sm" class="w-full" disabled color="agent">
            <!-- Personal Information Step -->
            <template #personalInformation>
              <UForm :state="state" :schema="personalSchema" ref="form" class="pt-6">
                <UFormField label="Email Address" name="email" size="lg" hint="Required" class="py-2" help="Your business email">
                  <UInput v-model="state.email" type="email" placeholder="Enter your email..." size="xl" class="w-full" autocomplete="on" color="agent" />
                </UFormField>
                <UFormField label="Main Contact Number" name="mainContact" size="lg" hint="Required" class="py-2" help="The number to reach you on">
                  <UInput v-model="state.mainContact" type="tel" placeholder="Enter contact number..." size="xl" class="w-full" color="agent" />
                </UFormField>
              </UForm>
            </template>

            <!-- Business Information Step -->
            <template #businessInformation>
              <UForm :state="state" :schema="businessSchema" ref="form" class="pt-6">
                <UFormField label="Business Name" name="businessName" size="lg" hint="Required" class="py-2" help="Your operating name">
                  <UInput v-model="state.businessName" type="text" placeholder="Enter name..." size="xl" class="w-full" color="agent" />
                </UFormField>
                <UFormField label="Company Registration Number" name="registrationNumber" size="lg" hint="Required" class="py-2" help="Your operating company registration number">
                  <UInput v-model="state.registrationNumber" type="string" placeholder="Enter registration number..." size="xl" class="w-full" color="agent" />
                </UFormField>
              </UForm>
            </template>

            <!-- Business Address Step -->
            <template #businessAddress>
              <UForm :state="state" :schema="addressSchema" ref="form" class="pt-6">
                <UFormField label="Address" name="addressLine" size="lg" hint="Required" class="py-2" help="Busisness Operating Address">
                  <UInput v-model="state.addressLine" type="text" placeholder="Enter address..." size="xl" class="w-full" color="agent" />
                </UFormField>
                <UFormField label="City" name="city" size="lg" hint="Required" class="py-2" help="Business Operating City">
                  <UInput v-model="state.city" type="text" placeholder="Enter city..." size="xl" class="w-full" color="agent" />
                </UFormField>
                <UFormField label="County" name="county" size="lg" hint="Required" class="py-2" help="Busness Operating County">
                  <UInput v-model="state.county" type="text" placeholder="Enter county..." size="xl" class="w-full" color="agent" />
                </UFormField>
                <UFormField label="Country" name="country" size="lg" hint="Required" class="py-2" help="Business Operating Country">
                  <UInput v-model="state.country" type="text" placeholder="Enter country..." size="xl" class="w-full" color="agent" />
                </UFormField>
                <UFormField label="Postcode" name="postcode" size="lg" hint="Required" class="py-2" help="Business Operating Postcode">
                  <UInput v-model="state.postcode" type="text" placeholder="Enter postcode..." size="xl" class="w-full" color="agent" />
                </UFormField>
              </UForm>
            </template>
          </UStepper>
          <!-- END stepper -->
          <div class="flex gap-2 justify-between mt-6">
            <UButton variant="outline" leading-icon="i-lucide-arrow-left" :disabled="!stepper?.hasPrev" @click="prevStep()" color="neutral" size="lg"> Prev </UButton>
            <UButton variant="outline" trailing-icon="i-lucide-arrow-right" :disabled="!stepper?.hasNext" @click="nextStep()" color="neutral" size="lg"> Next </UButton>
          </div>
          <UButton type="submit" color="agent" loading-auto size="xl" class="text-white mt-8" variant="solid" :disabled="submitState()"> Submit </UButton>
        </UForm>
        <!-- END form -->
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-purple-500 h-full xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-5xl italic p-4 text-center">For Agents</h2>
    </div>
  </div>
</template>
