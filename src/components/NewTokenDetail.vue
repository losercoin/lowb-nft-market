<template>
  <div>
    <div>
      <b-card no-body class="overflow-hidden">
        <b-row no-gutters>
          <b-col md="4">
            <b-card-img src="https://picsum.photos/400/400/?image=20" alt="Image" class="rounded-0"></b-card-img>
          </b-col>
          <b-col md="8">
            <b-card-body :title="$route.params.id">
              <p>group id: #1  In progress: 50/100</p>
              <p>Details: This a very hard to solve!!!</p>
              <br>
              <h4>Place a bid</h4>
              <p>Your lowb market balance: 1000 lowb</p>
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Amount of Lowb to Bid">
                <span class="input-group-text">lowb</span>
                <button class="btn btn-primary" type="button" id="button-addon2">Bid</button>
              </div>
              <div>Market Summary</div>
              <hr class="mt-1 mb-2">
              <p>Total Bidders: 2</p>
              <p>Top Bid: 1000 lowb</p>
              <br>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <br>

    <h2>Open Bids</h2>
    <b-table small :fields="bidFields" :items="bids" responsive="sm">
      <!-- A virtual column -->
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>

      <!-- A custom formatted column -->
      <template #cell(price)="data">
        {{data.item.price}} lowb
      </template>

      <!-- A virtual composite column -->
      <template #cell(action)="data">
        <a :href="'#'+data.item.maker">Approve</a> <a :href="'#'+data.item.maker">Accept</a>
      </template>

    </b-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        bidFields: [
          // A virtual column that doesn't exist in items
          'index',
          // A regular column
          'maker',
          // A regular column
          'taker',
          // A column that needs custom formatting
          { key: 'price', label: 'price' },
          // A virtual column that doesn't exist in items
          { key: 'action', label: 'action' }
        ],
        bids: [
          { maker: '0xD35a860B6fDB386Ae9d83D72209DAA704631CA15', taker: 'anyone', price: 42 },
          { maker: '0xD53a860B6fDB386Ae9d83D72209DAA704631CA15', taker: 'anyone', price: 55 },
          { maker: '0xD35a860B6fDB386Ae9d83D72209DAA704631CA15', taker: 'anyone', price: 42 }
        ]
      }
    }
  }
</script>