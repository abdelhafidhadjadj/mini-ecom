<script lang="ts">
  import { Building2, User, CheckCircle, Clock } from 'lucide-svelte';

  let { statsB2B, statsB2C, type, onSwitch } = $props<{
    statsB2B: { total: number; en_attente: number; approuve: number };
    statsB2C: { total: number };
    type: string;
    onSwitch: (t: string) => void;
  }>();
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">

  <div
    class="card border shadow-sm cursor-pointer transition-all"
    class:bg-warning={type === 'b2b'}
    class:text-warning-content={type === 'b2b'}
    class:bg-base-100={type !== 'b2b'}
    class:border-warning={type === 'b2b'}
    class:border-base-200={type !== 'b2b'}
    onclick={() => onSwitch('b2b')}
  >
    <div class="card-body p-4 gap-1">
      <div class="flex items-center gap-2">
        <Building2 size={16} />
        <span class="text-xs font-medium">B2B Clients</span>
      </div>
      <span class="text-2xl font-bold">{statsB2B.total}</span>
      {#if parseInt(String(statsB2B.en_attente)) > 0}
        <span class="text-xs opacity-70">{statsB2B.en_attente} pending approval</span>
      {/if}
    </div>
  </div>

  <div
    class="card border shadow-sm cursor-pointer transition-all"
    class:bg-info={type === 'b2c'}
    class:text-info-content={type === 'b2c'}
    class:bg-base-100={type !== 'b2c'}
    class:border-info={type === 'b2c'}
    class:border-base-200={type !== 'b2c'}
    onclick={() => onSwitch('b2c')}
  >
    <div class="card-body p-4 gap-1">
      <div class="flex items-center gap-2">
        <User size={16} />
        <span class="text-xs font-medium">B2C Customers</span>
      </div>
      <span class="text-2xl font-bold">{statsB2C.total}</span>
    </div>
  </div>

  <div class="card bg-base-100 border border-base-200 shadow-sm">
    <div class="card-body p-4 gap-1">
      <div class="flex items-center gap-2 text-success">
        <CheckCircle size={16} />
        <span class="text-xs font-medium">Approved B2B</span>
      </div>
      <span class="text-2xl font-bold text-success">{statsB2B.approuve}</span>
    </div>
  </div>

  <div class="card bg-base-100 border border-base-200 shadow-sm">
    <div class="card-body p-4 gap-1">
      <div class="flex items-center gap-2 text-warning">
        <Clock size={16} />
        <span class="text-xs font-medium">Pending B2B</span>
      </div>
      <span class="text-2xl font-bold text-warning">{statsB2B.en_attente}</span>
    </div>
  </div>

</div>