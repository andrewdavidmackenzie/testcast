package net.mackenzie.testcast;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.Menu;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import net.mackenzie.chromecast.ChromecastInteractor;

/**
 * Main activity of the application
 */
public class MainActivity extends AppCompatActivity {
    private ChromecastInteractor chromecast;
    private TestControllerView testControllerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        TestController testController = new TestController();
        testControllerView = new TestControllerView(this, getString(R.string.app_id), testController);
        chromecast = new ChromecastInteractor(this, getString(R.string.app_id), getString(R.string.namespace),
                testControllerView.getMediaSelector(), testController);
    }

    @Override
    protected void onPause() {
        // TODO try doing this always to make synetrical with onResume()
        if (isFinishing()) {
            chromecast.pause();
        }
        super.onPause();
    }

    // TODO Avoid Pause/Resume on first rotation
    @Override
    protected void onResume() {
        super.onResume();
        chromecast.resume();
    }

    @Override
    public void onDestroy() {
        chromecast.disconnect();
        super.onDestroy();
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
    }

    /**
     * Add the MediaRoute ("Chromecast") button to the ActionBar at the top of the app
     *
     * @param menu - menu to add the menu items to
     * @return true if added an item
     */
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        getMenuInflater().inflate(R.menu.main, menu);
        testControllerView.setMediaRouteSelector(menu);
        return true;
    }
}