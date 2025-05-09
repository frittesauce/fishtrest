<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { signIn } from '$lib/auth-client';
	import { currentUser } from '$lib/stores/user';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';
	import LoggedInPage from './LoggedInPage.svelte';

	let { data } = $props();

	let userData = {
		username: ''
	};

	let avatar = $state('/default.png');
	let fileInput: Blob = $state(new Blob());

	let inCreation: boolean = false;
	let step: number = $state(0);
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
			callbackURL: env.PUBLIC_BASE_URL
		});
	}

	function handleImageUpload() {
		let inputElement = document.createElement('input');
		inputElement.type = 'file';
		inputElement.accept = 'image/*';
		inputElement.onchange = (e: any) => {
			let file = e.target?.files[0];
			if (file) {
				fileInput = file;
				avatar = URL.createObjectURL(fileInput);
			}
		};
		inputElement.click();
	}

	const pages = { 1: authMethod, 2: userName, 3: imageUpload, 4: finishPage };

	let usernameInput: string = $state('');
	let enableSubmitButton: boolean = $state(true);

	const handleUsernameSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		console.log(usernameInput);
		enableSubmitButton = false;
		if (usernameInput.replace(/[^0-9a-z]/gi, '').length < 3) {
			toast.error('username must atleast be 3 characters!');
			return;
		}

		const response = await fetch(`/api/usernameAvailable?username=${usernameInput}`);

		if (response.ok) {
			step = 3;
			userData.username = usernameInput;
			enableSubmitButton = true;
			return;
		}

		switch (response.status) {
			case 400:
				toast.error('something went wrong please try again later');
				break;
			case 409:
				toast.error('username is already taken!');
				break;
			default:
				toast.error('something went wrong please try again later');
				break;
		}
		enableSubmitButton = true;
	};

	async function handleFinish() {
		const formdata = new FormData();

		formdata.append('image', fileInput);
		formdata.append('username', usernameInput);

		const res = await fetch('/api/profileInit', {
			method: 'POST',
			body: formdata
		});

		if (res.ok) {
			goto(data.Callback ? `/${data.Callback}` : '/', { replaceState: true });
			invalidateAll();
		}
	}
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
	<form class="font-normal" onsubmit={handleUsernameSubmit}>
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

{#snippet imageUpload()}
	<h2>upload a profile picture!</h2>
	<div>
		<button
			onclick={() => {
				handleImageUpload();
			}}
		>
			<img src={avatar} alt="cool" class=" h-96 w-96 rounded-full hover:cursor-pointer" />
		</button>
	</div>
	<button
		onclick={() => {
			if (fileInput.size <= 0) {
				return toast.error('kutje upload wel een foto kut kind');
			}
			step = 4;
		}}>done!</button
	>
{/snippet}

{#snippet finishPage()}
	<h2>is this correct?</h2>
	<div class="flex">
		<img src={avatar} alt="your avatar" class="h-96 w-96 rounded-full" />
		<p>{usernameInput}</p>
	</div>
	<button disabled={!enableSubmitButton} onclick={handleFinish}
		>{enableSubmitButton ? 'confirm' : 'loading'}</button
	>
{/snippet}

<div class="relative min-h-screen w-full overflow-x-hidden">
	{#if !$currentUser?.finishedOnboard}
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
						{@render pages[step as keyof typeof pages]()}
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<LoggedInPage></LoggedInPage>
	{/if}
</div>
