<template>
	<div>Value: {{ value }}
		<button @click="test"  @click.stop> test</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, toRefs,  } from 'vue';
import { useExtensions, useLayout, useCollection, useItems, useStores } from '@directus/extensions-sdk';

// @ts-ignore
// import { useShortcut } from '@/composables/use-shortcut';
export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},

	},
	data(){
        return {
            layout: '',
            userColl: null,
            customerColl: null,
            items: null,
        }
    },

	methods: {
		test( ) {
			console.log('<--------------- JK Display --------------->');
			console.log(this.layout);
			console.log(this.userColl);
			console.log(this.customerColl);
			console.log(this.items);
		},
		async test2( )  {
			const collectionCustomer: any   = toRefs({ value: 'customer' });
			this.customerColl = useCollection( 'customer' );
			const {primaryKeyField, fields} = this.customerColl
			console.log('<--------------- JK Display --------------->');
			console.log({primaryKeyField, fields});
			const query : any = {
				fields: toRefs({ fields:['*'] })
				// ...toRefs({ fields: ['*'] }),
				// ...toRefs({limit: -1} ),
				// ...toRefs({ sort: null } ),
				// ...toRefs({ search: '' } ),
				// ...toRefs({ filter: null } ),
				// ...toRefs({ page: 1 } ),
			};
			console.log(query, collectionCustomer);
			
			const { itemCount , totalCount , items , totalPages , loading , error} = useItems( collectionCustomer, query);
			console.log('<--------------- JK Display --------------->');
			// const {  getItems, } = this.items;
			// const i = await getItems();
			console.log( {itemCount , totalCount , items , totalPages , loading , error } );

			const useStore = useStores();
			console.log(useStore);
			
			const { useAppStore, useCollectionsStore } = useStore;
			console.log('<--------------- JK Display --------------->');
			const useApp = useAppStore();
			const useCollApp = useCollectionsStore();
			console.log({useApp});
			console.log({useCollApp});
		},
	},
    watch: {
    },
	async created()  {
		// await	this.test2()
	},
});
</script>
