<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
const { showToast } = useToastNotification();

/**
 * Form validation schema
 */
const schema = z
  .object({
    email: z.string().email("Email Address Required").nonempty("Invalid email address"),
    role: z.boolean().default(false),
    password: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
    confirmedPassword: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

/**
 * Personal information schema
 */
const personalSchema = z.object({
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
type Schema = z.output<typeof schema>;

/**
 * Form state
 */
const state = reactive<Partial<Schema & PersonalSchema & BusinessSchema & AddressSchema>>({
  email: "",
  password: "",
  confirmedPassword: "",
  role: false,
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
const mainForm = useTemplateRef("mainForm");
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
 * Next step handler
 * Validate the current form step and move to the next step
 */
async function nextStep() {
  try {
    if (form.value && mainForm.value) {
      await mainForm.value.validate({ nested: true });
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
  const isEmailValid = !schema.safeParse(state).error; // Check email validity
  const isPersonalValid = !personalSchema.safeParse(state).error;
  const isBusinessValid = !businessSchema.safeParse(state).error;
  const isAddressValid = !addressSchema.safeParse(state).error;

  if (state.role) {
    return !(isPersonalValid && isBusinessValid && isAddressValid && isEmailValid);
  }
  return !isEmailValid;
}

/**
 * Signup function
 *
 * The users role is set here on user creation.
 * This is an important step determining if the user is an agent or a normal user and has knock on effects.
 */
async function signup(event: FormSubmitEvent<any>) {
  interface SignupResponse {
    userID: string;
    email: string;
    token: string;
    otpCode: string;
  }
  try {
    const user = await $fetch<SignupResponse>("/auth/signup", {
      method: "POST",
      body: {
        ...state,
      },
    });
    // redirect to login page
    console.log(user);
    navigateTo("/verify/" + user.token);
  } catch (error) {
    showToast({
      title: (error as { data: { message: string } }).data.message,
      icon: "ri:error-warning-line",
    });
  }
}
</script>

<template>
  <div class="flex justify-center items-center w-full p-4 sm:p-0">
    <div class="w-full sm:w-lg">
      <!-- pre form content -->
      <h1 class="text-3xl font-bold mb-6">Signup</h1>
      <p class="mb-6">Signup quickly to Virify to gain access to creating you own listings and much more...</p>
      <!-- UI Form -->
      <UForm @submit="signup" :state="state" :schema="schema" class="w-full pb-10" ref="mainForm">
        <!-- email input -->
        <UFormField label="Email" name="email" size="xl" hint="Required" class="py-2 mb-2">
          <UInput v-model="state.email" type="email" placeholder="JohnDoe@email.com" size="xl" class="w-full" autocomplete="on" />
        </UFormField>
        <!-- password input -->
        <UFormField label="Password" name="password" size="xl" hint="Required" class="py-2 mb-2">
          <UInput v-model="state.password" type="password" placeholder="Enter your password" size="xl" class="w-full" />
        </UFormField>
        <!-- password input -->
        <UFormField label="Confirm Password" name="confirmedPassword" size="xl" hint="Required" class="py-2 mb-2">
          <UInput v-model="state.confirmedPassword" type="password" placeholder="Enter your password again" size="xl" class="w-full" />
        </UFormField>
        <!-- role input -->
        <label for="role">
          <input type="checkbox" label="Estate Agent?" name="role" v-model="state.role" />
          Estate Agent?
        </label>
        <!-- start of form -->
        <UForm v-if="state.role" :state="state" ref="form" class="w-full">
          <!-- Stepper -->
          <UStepper ref="stepper" :items="formStep" size="md" disabled color="primary" class="w-full pt-8">
            <!-- Personal Information Step -->
            <template #personalInformation>
              <div class="flex items-center justify-center flex-col pt-6">
                <UForm :state="state" :schema="personalSchema" ref="form" class="w-full">
                  <!-- main contact number field -->
                  <UFormField label="Main Contact Number" name="mainContact" size="xl" hint="Required" help="The number to reach you on" class="pb-4">
                    <UInput v-model="state.mainContact" type="tel" placeholder="Enter contact number..." size="xl" class="w-full" />
                  </UFormField>
                </UForm>
              </div>
            </template>

            <!-- Business Information Step -->
            <template #businessInformation>
              <div class="flex items-center justify-center flex-col pt-6">
                <UForm :state="state" :schema="businessSchema" ref="form" class="w-full">
                  <!-- Business Name Field -->
                  <UFormField label="Business Name" name="businessName" size="xl" hint="Required" help="Your operating name" class="pb-4">
                    <UInput v-model="state.businessName" type="text" placeholder="Enter name..." size="xl" class="w-full" />
                  </UFormField>
                  <!-- Registration Number Field -->
                  <UFormField label="Company Registration Number" name="registrationNumber" size="xl" hint="Required" help="Your operating company registration number" class="pb-4">
                    <UInput v-model="state.registrationNumber" type="string" placeholder="Enter registration number..." size="xl" class="w-full" />
                  </UFormField>
                </UForm>
              </div>
            </template>

            <!-- Business Address Step -->
            <template #businessAddress>
              <div class="flex items-center justify-center flex-col w-full pt-6">
                <UForm :state="state" :schema="addressSchema" ref="form" class="w-full">
                  <!-- Operating Address Field -->
                  <UFormField label="Address" name="addressLine" size="xl" hint="Required" help="Busisness Operating Address" class="pb-4">
                    <UInput v-model="state.addressLine" type="text" placeholder="Enter address..." size="xl" class="w-full" />
                  </UFormField>
                  <!-- City Field -->
                  <UFormField label="City" name="city" size="xl" hint="Required" help="Business Operating City" class="pb-4">
                    <UInput v-model="state.city" type="text" placeholder="Enter city..." size="xl" class="w-full" />
                  </UFormField>
                  <!-- County Field -->
                  <UFormField label="County" name="county" size="xl" hint="Required" help="Busness Operating County" class="pb-4">
                    <UInput v-model="state.county" type="text" placeholder="Enter county..." size="xl" class="w-full" />
                  </UFormField>
                  <!-- Country Field -->
                  <UFormField label="Country" name="country" size="xl" hint="Required" help="Business Operating Country" class="pb-4">
                    <UInput v-model="state.country" type="text" placeholder="Enter country..." size="xl" class="w-full" />
                  </UFormField>
                  <!-- Postcode Field -->
                  <UFormField label="Postcode" name="postcode" size="xl" hint="Required" help="Business Operating Postcode" class="pb-4">
                    <UInput v-model="state.postcode" type="text" placeholder="Enter postcode..." size="xl" class="w-full" />
                  </UFormField>
                </UForm>
              </div>
            </template>
            <!-- end Address Step -->
          </UStepper>
        </UForm>
        <!-- Stepper buttons -->
        <div v-if="state.role" class="flex gap-2 justify-between mt-6 w-full">
          <UButton variant="outline" leading-icon="i-lucide-arrow-left" :disabled="!stepper?.hasPrev" @click="prevStep()" size="xl"> Prev </UButton>
          <UButton variant="outline" trailing-icon="i-lucide-arrow-right" :disabled="!stepper?.hasNext" @click="nextStep()" size="xl"> Next </UButton>
        </div>
        <!-- Submit button -->
        <div class="w-full sm:w-md">
          <UButton type="submit" loading-auto size="xl" class="mt-8 px-4" variant="solid" :disabled="submitState()"> Submit </UButton>
        </div>
        <!-- END submit button -->
      </UForm>
      <!-- END UI Form -->
    </div>
  </div>
</template>
