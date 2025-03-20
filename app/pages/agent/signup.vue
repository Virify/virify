<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
const { showToast } = useToastNotification();

/**
 * Personal information schema
 */
const personalSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  mainContact: z.string().nonempty("Main contact number is required"),
});

/**
 * Business information schema
 */
const businessSchema = z.object({
  businessName: z.string().nonempty("Business name is required"),
  registrationNumber: z.string().nonempty("Registration number is required"),
});

/**
 * Address schema
 */
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

/**
 * Form state
 */
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

const stepper = useTemplateRef("stepper");
const form = useTemplateRef("form");
const isXs = ref(false);

/**
 * Form stepper items
 */
const formStep = ref([
  { slot: "personalInformation", title: "Personal Information", icon: "i-lucide-user" },
  { slot: "businessInformation", title: "Business Information", icon: "i-lucide-briefcase" },
  { slot: "businessAddress", title: "Business Address", icon: "i-lucide-map-pin" },
]);

/**
 * Form submit handler
 * note the role is hardcoded to agent
 * This is because the signup page is only for agents
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

/**
 * Reactive window size tracking
 * This is used to determine if the screen size is xs or not
 */
const updateSize = () => {
  isXs.value = window.innerWidth < 475;
};

/**
 * Check if window is defined
 * This is to prevent SSR issues
 * We only want to run this on the client side
 */
if (typeof window !== "undefined") {
  updateSize();
  window.addEventListener("resize", updateSize);
}

/**
 * Cleanup
 */
onUnmounted(() => {
  window.removeEventListener("resize", updateSize);
});

/**
 * Watch for window size changes
 * This is to prevent SSR issues
 * We only want to run this on the client side
 */
watchEffect(() => {
  if (typeof window !== "undefined") {
    updateSize();
  }
});
</script>

<template>
  <!-- container -->
  <div class="flex justify-center items-center flex-col py-12 px-2 w-full">
    <!-- Pre Form Content -->
    <div class="max-w-md w-full justify-baseline p-4 sm:p-0">
      <h1 class="text-4xl --ui-text font-semibold pb-6">Sign up</h1>
      <p class="--ui-text pb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil doloremque distinctio commodi laborum accusantium?</p>
    </div>

    <!-- start of form -->
    <UForm @submit="onSubmit" :state="state" ref="form" class="flex flex-col justify-center items-center w-full mt-6 p-4 sm:p-0">
      <!-- Stepper -->
      <UStepper ref="stepper" :items="formStep" :size="isXs ? 'xs' : 'lg'" disabled color="primary" class="flex justify-center w-full sm:w-4xl">
        <!-- Personal Information Step -->
        <template #personalInformation>
          <div class="flex items-center justify-center flex-col w-full pt-6">
            <UForm :state="state" :schema="personalSchema" ref="form" class="w-full sm:w-md">
              <!-- email field -->
              <UFormField label="Email Address" name="email" size="lg" hint="Required" class="py-2" help="Your business email">
                <UInput v-model="state.email" type="email" placeholder="Enter your email..." size="lg" autocomplete="on" class="w-full" />
              </UFormField>
              <!-- main contact number field -->
              <UFormField label="Main Contact Number" name="mainContact" size="lg" hint="Required" class="py-2" help="The number to reach you on">
                <UInput v-model="state.mainContact" type="tel" placeholder="Enter contact number..." size="lg" class="w-full" />
              </UFormField>
            </UForm>
          </div>
        </template>

        <!-- Business Information Step -->
        <template #businessInformation>
          <div class="flex items-center justify-center flex-col w-full pt-6">
            <UForm :state="state" :schema="businessSchema" ref="form" class="w-full sm:w-md">
              <!-- Business Name Field -->
              <UFormField label="Business Name" name="businessName" size="lg" hint="Required" class="py-2" help="Your operating name">
                <UInput v-model="state.businessName" type="text" placeholder="Enter name..." size="xl" />
              </UFormField>
              <!-- Registration Number Field -->
              <UFormField label="Company Registration Number" name="registrationNumber" size="lg" hint="Required" class="py-2" help="Your operating company registration number">
                <UInput v-model="state.registrationNumber" type="string" placeholder="Enter registration number..." size="xl" />
              </UFormField>
            </UForm>
          </div>
        </template>

        <!-- Business Address Step -->
        <template #businessAddress>
          <div class="flex items-center justify-center flex-col w-full pt-6">
            <UForm :state="state" :schema="addressSchema" ref="form" class="w-full sm:w-md">
              <!-- Operating Address Field -->
              <UFormField label="Address" name="addressLine" size="lg" hint="Required" class="py-2" help="Busisness Operating Address">
                <UInput v-model="state.addressLine" type="text" placeholder="Enter address..." size="xl" />
              </UFormField>
              <!-- City Field -->
              <UFormField label="City" name="city" size="lg" hint="Required" class="py-2" help="Business Operating City">
                <UInput v-model="state.city" type="text" placeholder="Enter city..." size="xl" />
              </UFormField>
              <!-- County Field -->
              <UFormField label="County" name="county" size="lg" hint="Required" class="py-2" help="Busness Operating County">
                <UInput v-model="state.county" type="text" placeholder="Enter county..." size="xl" />
              </UFormField>
              <!-- Country Field -->
              <UFormField label="Country" name="country" size="lg" hint="Required" class="py-2" help="Business Operating Country">
                <UInput v-model="state.country" type="text" placeholder="Enter country..." size="xl" />
              </UFormField>
              <!-- Postcode Field -->
              <UFormField label="Postcode" name="postcode" size="lg" hint="Required" class="py-2" help="Business Operating Postcode">
                <UInput v-model="state.postcode" type="text" placeholder="Enter postcode..." size="xl" />
              </UFormField>
            </UForm>
          </div>
        </template>
        <!-- end Address Step -->
      </UStepper>
      <!-- Stepper buttons -->
      <div class="flex gap-2 justify-between mt-6 w-full sm:w-md">
        <UButton variant="outline" leading-icon="i-lucide-arrow-left" :disabled="!stepper?.hasPrev" @click="prevStep()" size="lg"> Prev </UButton>
        <UButton variant="outline" trailing-icon="i-lucide-arrow-right" :disabled="!stepper?.hasNext" @click="nextStep()" size="lg"> Next </UButton>
      </div>
      <!-- Submit button -->
      <div class="w-full sm:w-md">
        <UButton type="submit" loading-auto size="xl" class="mt-8 px-4" variant="solid" :disabled="submitState()"> Submit </UButton>
      </div>
      <!-- END submit button -->
    </UForm>
    <!-- END form -->
  </div>
</template>
