<template>
    <header class="p-3 mb-3 border-bottom">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/lowb-market" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
          <icon-base width="40" height="40" icon-name="lowb"><icon-lowb /></icon-base> 
          <span class="fs-4">Lowb NFT Market</span>
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" class="nav-link px-2 link-secondary">Overview</a></li>
          <li><router-link to="/lowb-market/foo" class="nav-link px-2 link-dark">Owners</router-link></li>
          <li><router-link to="/lowb-market/bar" class="nav-link px-2 link-dark">About</router-link></li>
        </ul>

        <div>
          <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" right>
            <template #button-content>
              <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
            </template>
            <b-dropdown-item><router-link to="/lowb-market/my-nfts" class="nav-link px-2 link-dark">View My NFTs</router-link></b-dropdown-item>
            <b-dropdown-item><a href="#" class="nav-link px-2 link-dark">Sign out</a></b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </header>
</template>

<script>
import IconBase from './IconBase.vue'
import IconLowb from './icons/IconLowb.vue'

export default {
  components: {
    IconBase,
    IconLowb
  }
}
</script>