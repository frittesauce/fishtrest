<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { signIn } from '$lib/auth-client';
	import { currentUser } from '$lib/stores/user';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let userData = {
		username: ''
	};

	let inCreation: boolean = false;
	let step: number = $state(0);
	// svelte-ignore state_referenced_locally
	let topMargin: string = $state(inCreation ? '40vh' : '15vh');

	$effect(() => {
		inCreation = step > 0 ? true : false;
		topMargin = inCreation ? '40vh' : '15vh';

		if ((data?.Callback || (!$currentUser?.finishedOnboard && $currentUser)) && step == 0) {
			step = 2;
		}
	});

	function handleAuth(customStep?: number) {
		inCreation = true;
		step = customStep! | 1;
	}

	async function handleLogin(provider: 'discord') {
		signIn.social({
			provider: provider,
			callbackURL: env.PUBLIC_BASE_URL + '?callback=/'
		});
	}

	const pages = { 1: authMethod, 2: userName };

	let usernameInput: string = $state('');
	let enableSubmitButton: boolean = $state(true);
</script>

{#snippet authMethod()}
	<h2>choose an authentication method!</h2>
	<button
		class=" w-64 rounded-lg border border-gray-700 p-2 text-xl font-semibold shadow-sm hover:cursor-pointer hover:bg-gray-200"
		onclick={() => {
			handleLogin('discord');
		}}>discord</button
	>
{/snippet}

{#snippet userName()}
	<h2 class=" text-xl">what shall we call you?</h2>
	<form
		class="font-normal"
		onsubmit={async (e) => {
			e.preventDefault();

			console.log(usernameInput);
			enableSubmitButton = false;
			if (usernameInput.replace(/[^0-9a-z]/gi, '').length < 3) {
				toast.error('username must atleast be 3 characters!');
				return;
			}

			const response = await fetch(`/api/usernameAvailable?username=${usernameInput}`);
			const body = await response.json();

			if (response.ok) {
				step = 3;
				userData.username = usernameInput;
				return;
			}

			switch (body.status) {
				case 400:
					toast.error('something went wrong please try again later');
				case 409:
					toast.error('username is already taken!');
				default:
					toast.error('something went wrong please try again later');
			}
			enableSubmitButton = true;
		}}
	>
		<input
			name="username"
			class=" text-lg2 h-8 w-64 rounded-lg border shadow"
			maxlength="21"
			bind:value={usernameInput}
			oninput={() => {
				usernameInput = '@' + usernameInput.replace(/[^0-9a-z]/gi, '').toLowerCase();
			}}
			required
			placeholder="@phpfan2018"
		/>
		<button type="submit" disabled={!enableSubmitButton}>
			{enableSubmitButton ? 'confirm!' : 'loading'}
		</button>
	</form>
{/snippet}

<div class="relative min-h-screen w-full overflow-x-hidden">
	<div class="mx-auto px-4">
		<div
			class="flex w-full flex-col items-center transition-all duration-700 ease-out"
			style="margin-top: calc(50vh - {topMargin}"
		>
			<div class=" flex flex-col justify-center gap-3 text-center sm:gap-8">
				<h1 class=" text-6xl font-bold sm:text-8xl">fishtrest</h1>
				{#if step == 0}
					<p class=" text-xl sm:text-2xl">the number 1 image sharing platform</p>
					<button
						onclick={() => {
							handleAuth();
						}}
						class=" w-max self-center rounded-xl bg-indigo-800 p-2 text-2xl font-semibold text-white sm:p-4 sm:text-3xl"
						>Join Today</button
					>
				{:else}
					<hr class=" mb-6 bg-gray-400" />
				{/if}
			</div>
			{#if step >= 1}
				<div class="max-w-[600px] text-center text-lg font-semibold sm:text-xl">
					<h1>Creating Account</h1>
					<hr class=" m-4 bg-gray-400" />
					{@render pages[step]()}
				</div>
			{/if}
		</div>
	</div>
</div>
